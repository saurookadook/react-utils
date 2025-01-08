import { defineConfig, type Options } from 'tsup';

const sharedConfig: Options = {
    clean: true,
    dts: true, // Generate declaration files (.d.ts)
    entryPoints: ['./src/index.ts'],
    external: ['react'],
    sourcemap: true,
    /**
     * This option fixes a weird bug with resolution of default exports
     * @see {@link https://github.com/egoist/tsup/issues/572#issuecomment-1927105408 | tsup/issues/572}
     */
    splitting: true,
};

function buildTsupConfig(options = {}): Options {
    return {
        ...sharedConfig,
        ...options,
    };
}

export default defineConfig((options: Options) => {
    const isProd = process.env.NODE_ENV === 'production';

    return [
        buildTsupConfig({
            ...options,
            format: ['cjs'],
            minify: isProd,
            target: ['node16'],
            outDir: 'dist/commonjs',
        }),
        buildTsupConfig({
            ...options,
            format: ['esm'],
            minify: isProd,
            target: ['es2020'],
            outDir: 'dist/esm',
        }),
    ];
});
