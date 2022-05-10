const error = (...args) => {
    process.stderr.write(`${args.join(" ")}\n`);
    process.exit(1);
};
export { error };
