import { SimpleCard } from '../../ui/simple-card/simple-card.component';
import { CustomInput } from '../../ui/custom-input/custom-input.component';
import { CustomButton } from '../../ui/custom-button/custom-button.component';
import { login, getUser } from '../users.service';
import { useAuth } from '../auth/auth.context';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export const LoginCard = () => {
    const { user, setUser } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const updateUserAndLogin = () => {
        getUser().then(res => {
            if (res.status === 200) {
                setUser(res.data)
            }
        })
    }

    const isValueValid = (value) => {
        return value && value.trim()
    }

    const formIsComplete = () => {
        let formIsComplete = true

        if (!isValueValid(email)) {
            formIsComplete = false
        }

        if (!isValueValid(password)) {
            formIsComplete = false
        }

        return formIsComplete
    }

    const onSubmit = (event) => {
        event.preventDefault()

        if (!formIsComplete()) {
            return
        }

        login(email, password).then(res => {
            if (res.status === 200) {
                setErrorMessage(null)
                updateUserAndLogin()
            }
        }).catch(e => {
            setErrorMessage(e.response.data)
        })
    }

    const onClickRegister = () => {
        navigate("/register")
    }

    const renderErrorMessage = () => {
        if (errorMessage) {
            return (<p className='card-error-message' data-testid={`login-error-message`}>{errorMessage}</p>)
        }
    }

    return (
        <SimpleCard title="Login" testid="login-card" className="big-card">
            <form data-testid="login-form" onSubmit={onSubmit}>
                {renderErrorMessage()}
                <CustomInput 
                    name="email" 
                    className='max-size-input'
                    value={email} 
                    setter={setEmail} 
                    require
                />
                <CustomInput 
                    name="password" 
                    className='max-size-input'
                    value={password} 
                    setter={setPassword} 
                    secret 
                    required
                />
                <div className="form-actions-wrapper">
                    <CustomButton 
                        primary={false}
                        className='small-button'
                        text="Register"
                        onClick={onClickRegister}
                        testid="registerBt"
                    />
                    <CustomButton
                        className='small-button'
                        testid="loginBt"
                        text="Submit"
                    />
                </div>
            </form>
        </SimpleCard>
      );
};


