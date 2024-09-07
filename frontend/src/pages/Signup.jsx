import AuthForm from "../components/AuthForm";

const Signup = () => {
    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div>
            <AuthForm type="signup" onSubmit={onSubmit} />
        </div>
    );
};

export default Signup;
