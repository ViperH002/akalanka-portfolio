/**
 * Lightweight in-memory observability & metrics engine.
 * Tracks rolling request latencies, status distributions, CPU, and memory metrics
 * with zero external dependencies and zero-overhead circular buffer design.
 */

interface MetricsSnapshot {
  uptimeSeconds: number;
  totalRequests: number;
  successRate: number;
  statusCodes: {
    "2xx": number;
    "3xx": number;
    "4xx": number;
    "5xx": number;
  };
  latency: {
    p50Ms: number;
    p90Ms: number;
    p99Ms: number;
    avgMs: number;
    minMs: number;
    maxMs: number;
  };
  cpu: {
    userMs: number;
    systemMs: number;
  };
}

class MetricsCollector {
  private readonly bufferSize = 500;
  private latencies: number[] = [];
  private pointer = 0;
  private totalRequests = 0;
  private status2xx = 0;
  private status3xx = 0;
  private status4xx = 0;
  private status5xx = 0;
  private initialCpu = process.cpuUsage();

  /**
   * Records an incoming HTTP request lifecycle
   */
  recordRequest(durationMs: number, statusCode: number): void {
    this.totalRequests++;

    if (statusCode >= 200 && statusCode < 300) {
      this.status2xx++;
    } else if (statusCode >= 300 && statusCode < 400) {
      this.status3xx++;
    } else if (statusCode >= 400 && statusCode < 500) {
      this.status4xx++;
    } else if (statusCode >= 500) {
      this.status5xx++;
    }

    // Circular buffer insertion to avoid unbounded memory growth
    if (this.latencies.length < this.bufferSize) {
      this.latencies.push(durationMs);
    } else {
      this.latencies[this.pointer] = durationMs;
      this.pointer = (this.pointer + 1) % this.bufferSize;
    }
  }

  /**
   * Calculates percentile latency from recorded samples
   */
  private getPercentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return Math.round((sorted[Math.max(0, Math.min(index, sorted.length - 1))] || 0) * 100) / 100;
  }

  /**
   * Generates a snapshot of application runtime metrics
   */
  getSnapshot(): MetricsSnapshot {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const avg = sorted.length > 0 ? Math.round((sum / sorted.length) * 100) / 100 : 0;
    const min = sorted.length > 0 ? sorted[0] : 0;
    const max = sorted.length > 0 ? sorted[sorted.length - 1] : 0;

    const cpuDiff = process.cpuUsage(this.initialCpu);

    const nonErrorCount = this.status2xx + this.status3xx;
    const successRate =
      this.totalRequests > 0
        ? Math.round((nonErrorCount / this.totalRequests) * 10000) / 100
        : 100;

    return {
      uptimeSeconds: Math.floor(process.uptime()),
      totalRequests: this.totalRequests,
      successRate,
      statusCodes: {
        "2xx": this.status2xx,
        "3xx": this.status3xx,
        "4xx": this.status4xx,
        "5xx": this.status5xx,
      },
      latency: {
        p50Ms: this.getPercentile(sorted, 50),
        p90Ms: this.getPercentile(sorted, 90),
        p99Ms: this.getPercentile(sorted, 99),
        avgMs: avg,
        minMs: min,
        maxMs: max,
      },
      cpu: {
        userMs: Math.round(cpuDiff.user / 1000),
        systemMs: Math.round(cpuDiff.system / 1000),
      },
    };
  }
}

// Singleton global metrics collector
export const metricsCollector = new MetricsCollector();
