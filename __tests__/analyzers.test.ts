import { ErrorWarningAnalyzer } from '../src/services/analyzers/ErrorWarningAnalyzer';
import { BuildTimeAnalyzer } from '../src/services/analyzers/BuildTimeAnalyzer';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('ErrorWarningAnalyzer', () => {
    let analyzer: ErrorWarningAnalyzer;

    beforeEach(() => {
        analyzer = new ErrorWarningAnalyzer();
        jest.clearAllMocks();
    });

    test('should group identical errors', () => {
        const lines = [
            'Error: Identical error',
            'Some log line',
            'Error: Identical error'
        ];

        const result = analyzer.analyze(lines);

        // Check Markdown contains grouping
        expect(result.markdown).toContain('| 🛑 Error | 1, 3 | `Error: Identical error` |');

        // Assert annotations are still made for each occurrence (or maybe we change this future, but currently present)
        expect(core.error).toHaveBeenCalledTimes(2);
    });

    test('should distinct errors', () => {
        const lines = [
            'Error: A',
            'Error: B'
        ];
        const result = analyzer.analyze(lines);
        expect(result.markdown).toContain('| 🛑 Error | 1 | `Error: A` |');
        expect(result.markdown).toContain('| 🛑 Error | 2 | `Error: B` |');
    });
});

describe('BuildTimeAnalyzer', () => {
    let analyzer: BuildTimeAnalyzer;

    beforeEach(() => {
        analyzer = new BuildTimeAnalyzer();
    });

    test('should parse build success time', () => {
        const lines = [
            '> Task :app:assembleDebug',
            'BUILD SUCCESSFUL in 1m 23s'
        ];
        const result = analyzer.analyze(lines);

        expect(result.markdown).toContain('- **Total Build Time**: 1m 23s');
    });

    test('should count task outcomes', () => {
        const lines = [
            '> Task :t1 UP-TO-DATE',
            '> Task :t2 SKIPPED',
            '> Task :t3', // Executed
            '> Task :t4 FROM-CACHE'
        ];
        const result = analyzer.analyze(lines);

        expect(result.markdown).toContain('Executed: 1');
        expect(result.markdown).toContain('CACHED / UP-TO-DATE: 2'); // UP-TO-DATE + FROM-CACHE
        expect(result.markdown).toContain('SKIPPED: 1');
    });
});
