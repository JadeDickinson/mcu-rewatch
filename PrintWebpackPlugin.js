class PrintWebpackPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(
            "PrintWebpackPlugin",
            (compilation) => {
                compilation.hooks.buildModule.tap("Print", (module) => {
                    console.log(module.resource);
                });
            }
        )
    }
};

module.exports = PrintWebpackPlugin;