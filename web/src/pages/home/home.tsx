import React, { useCallback, useState } from 'react';
import Input from 'rsuite/Input';
import Button from 'rsuite/Button';

export const Home: React.FC = () => {
    const [name, setName] = useState<string>('');
    const onSearch = useCallback(() => {
        console.log(name);
    }, [name]);

    return (
        <div>
            <h1>home</h1>

            <label>user name</label>
            <Input placeholder="input LeetCode user name" value={name} onChange={setName} />
            <Button appearance="primary" onClick={onSearch}>search</Button>
        </div>
    );
};
