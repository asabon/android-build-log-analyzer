export interface AnalysisResult {
    name: string;
    markdown: string;
    isFailed: boolean;
    failureMessage?: string;
}

export interface Analyzer {
    analyze(lines: string[]): AnalysisResult;
}
