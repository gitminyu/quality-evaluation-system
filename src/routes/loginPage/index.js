import { Card, Form, Button, Input, Divider, Col, Row, Image ,message} from "antd"
import {login,getVerifyCode,getCal}from "../../api"
import {useState,useEffect} from "react"
import { useNavigate  } from 'react-router-dom'
import './index.css'
function LoginPage(props) {
    const [vertical,setVertical] = useState('')
    const baseURL='http://localhost:8082'
    const [form] = Form.useForm();
    const navigate = useNavigate();
    useEffect(()=>{
        getVerify()
    },[])
    // 获取验证码
    function getVerify() {
        setVertical(`/getVerifyCode?${new Date().getTime()}`)
        // getVerifyCode().then(()=>{

        // })
    }
    function onFinish(values) {
        console.log(values,'value')
    }
    function onFinishFailed() {

    }
    async function handleLoginIn() {
        try{
            const value=await form.validateFields();
            let data={
                phone:value.phone.trim(),
                password:value.password.trim(),
                captcha:value.captcha.trim(),
            }
            // console.log(value,'value1')
            login(value).then((res)=>{
                if(res.code==='200'){
                    message.success(res.msg);
                    navigate("/main"); 
                    
                }else{
                    message.error(res.msg);
                    getVerify()
                }
            })
        }catch{

        }

    }
    return (
        <div className="login-page">
            <div
               className="login-form"
            >
                <Form
                    form={form}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label='手机号'
                        name='phone'
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号',
                            },
                        ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        label='密码'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password></Input.Password>
                    </Form.Item>
                    <Form.Item 
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    noStyle
                                    name="captcha"

                                ><Input></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>

                                <img onClick={getVerify} src={`${baseURL}${vertical}`}></img>

                            </Col>

                        </Row>
                    </Form.Item>
                    


                </Form>
                <Button type='primary' onClick={handleLoginIn}>登录</Button>
            </div>
        </div>

    )
}
export default LoginPage