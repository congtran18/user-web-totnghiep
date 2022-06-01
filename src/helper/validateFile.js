export const isFile = input => 'File' in window && input instanceof File;

export const checkListfile = (files) => {
    if (files) {
        if (files.length < 1) {
            return false
        }
        for (let i = 0; i < files.length; i++) {
            if (!isFile(files[i])) {
                return false
            }
        }
    }
    return true
}

export const checkIfFilesAreTooBig = (files) => {
    let valid = true
    if (checkListfile(files)) {
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const size = files[i].size / 1024 / 1024
                if (size > 30) {
                    valid = false
                }
            }
        }
    }
    return valid
}

export const checkIfFilesAreCorrectType = (files) => {
    let valid = true
    if (checkListfile(files)) {
        if (files) {
            for (let i = 0; i < files.length; i++) {
                if (!['application/pdf', 'application/docx'].includes(files[i].type)) {
                    valid = false
                }
            }
        }
    }

    return valid
}

export const checkIfFilesLength = (files) => {
    let valid = true
    if (checkListfile(files)) {
        if (files) {
            if (!files[0]) {
                valid = false
            }
        }
    }

    return valid
}