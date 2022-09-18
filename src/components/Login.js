import React, { useRef, useState } from "react"
import { Modal, Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import GoogleButton from 'react-google-button'
import DrawerAppBar from "./AppBar"
import ProductHero from "../views/ProductHero"


export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [show, setShow] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Error al ingresar")
    }

    setLoading(false)
  }

  const handleGoogleSignin = async () => {
    try {
      setError("")
      setLoading(true)
      await loginWithGoogle();
      history.push("/")
    } catch (error) {
      console.log(error)
      setError("Error al ingresar")
    }
    setLoading(false)
  };


  return (
    <>
      <DrawerAppBar onLoginClicked={()=> setShow(true)}></DrawerAppBar>
      <ProductHero />
      <Modal show={show} centered onHide={()=>setShow(false)}>
        <Modal.Body>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Ingresar a tu cuenta</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">
                  Ingresar
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="w-100 text-center mt-3">
              <GoogleButton disabled={loading}  type="dark" className="w-100"  onClick={handleGoogleSignin} label='Ingresar con Google'></GoogleButton>
              </div>
            </Card.Body>
          </Card>
        <div className="w-100 text-center mt-2">
        ¿No tenes una cuenta? <Link to="/signup">¡Registrate!</Link>
        </div>
        </Modal.Body>
      </Modal>
    </>
  )
}