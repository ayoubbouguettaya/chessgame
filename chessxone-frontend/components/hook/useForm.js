import { useState } from 'react';

const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);

    const handleOnChange = (event) => {
        event.persist();
        setValues((previousValues) => ({ ...previousValues, [event.target.name]: event.target.value }));
    }
    return ([values, handleOnChange])
}

export default useForm;
