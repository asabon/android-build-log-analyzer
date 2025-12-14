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
            'e: /path/One.kt: (1,1): Identical error',
            'Some log line',
            'Error: Identical error'
        ];

        // Note: currently implementation groups by exact message content.
        const result = analyzer.analyze(lines);

        // Check Markdown contains grouping for exact matches
        expect(result.markdown).toContain('| 🛑 Error | 1, 4 | `Error: Identical error` |');

        // Check Kotlin error detection
        expect(result.markdown).toContain('| 🛑 Error | 2 | `e: /path/One.kt: (1,1): Identical error` |');

        // Assert annotations are still made for each occurrence
        expect(core.error).toHaveBeenCalledTimes(3);
    });

    test('should detect kotlin warnings', () => {
        const lines = ['w: /path/Warning.kt: (1,1): Warning message'];
        const result = analyzer.analyze(lines);
        expect(result.markdown).toContain('| ⚠️ Warning | 1 | `w: /path/Warning.kt: (1,1): Warning message` |');
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
            ':t1 UP-TO-DATE', // No > Task prefix
            '> Task :t2 SKIPPED', // With prefix
            '> Task :t3', // Executed
            ':t4 FROM-CACHE' // No prefix
        ];
        const result = analyzer.analyze(lines);

        expect(result.markdown).toContain('Executed: 1');
        expect(result.markdown).toContain('CACHED / UP-TO-DATE: 2'); // UP-TO-DATE + FROM-CACHE
        expect(result.markdown).toContain('SKIPPED: 1');
    });
});
