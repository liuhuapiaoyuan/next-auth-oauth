import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      file: 'dist/index.esm.js', // ES模块格式
      format: 'esm',
      sourcemap: true,
    }
  ],
  external: ['next-auth','next'],
  watch: {
    include: 'src/**', // 指定要监视的文件
    clearScreen: false, // 在重建时是否清屏
  },
  plugins: [
    resolve(), // 解析 node_modules 中的模块
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' })
  ],
};