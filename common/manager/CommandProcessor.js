exports.process = (argv) => {
    let options = {};
    argv.forEach((val, index, array) => {
        if(index < 2)
            return;

        let option = val.split('=');
        if(option.length != 2)
            return;

        if(option[0] === 'name')
            options.name = option[1];
        else if(option[0] === 'number')
            options.number = option[1];
    });

    return options;
}