import { Card, Form, Button, Input, Divider, Col, Row, Image } from "antd"
import {login,getVerifyCode,getCal}from "../../api"
import {useState,useEffect} from "react"
import './index.css'
function LoginPage() {
    const [verticalUrl,setVerticalUrl] = useState('')
    useEffect(()=>{
        getVerify()
    },[])
    // 获取验证码
    function getVerify() {
        getVerifyCode().then(()=>{

        })
    }
    function onFinish() {

    }
    function onFinishFailed() {

    }
    function handleLoginIn() {

    }
    return (
        <div className="login-page">
            <Card
                style={{ width: 500 }}
            >
                <Form
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
                                    name="Captcha"

                                ><Input></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>

                                <Image></Image>

                            </Col>

                        </Row>
                    </Form.Item>



                </Form>
                <Button type='primary' onClick={handleLoginIn}>登录</Button>
            </Card>
        </div>

    )
}
export default LoginPage