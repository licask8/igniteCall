import { z } from 'zod'
import { AxiosError} from 'axios';
import { useEffect } from 'react'
import { api } from '../../lib/axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { ArrowArcRight } from 'phosphor-react'
import { zodResolver} from '@hookform/resolvers/zod'
import {Container, Form, FormError, Header} from './styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'


const registerFormSchema = z.object({
    username: z.string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.'})
    .regex(/^([a-z\\-]+)$/i,{
        message: 'O usuário pode ter apenas Letras e hifens.'
    })
    .transform(value => value.toLocaleLowerCase()),
    name: z.string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.'})
})

type RegisterFormSchemaData = z.infer<typeof registerFormSchema>

export default function Register() {
    const router = useRouter()

    const {register, handleSubmit, formState: {errors, isSubmitting }, setValue} = useForm<RegisterFormSchemaData>({
        resolver: zodResolver(registerFormSchema),
        
    })

    async function handleRegister(data: RegisterFormSchemaData) {
        try {
            await api.post('/users', {
                name: data.name,
                username: data.username,
            })

            await router.push('register/connect-calendar');

        } catch (error) {
           if (error instanceof AxiosError && error?.response?.data?.message) {
            alert(error.response.data.message)
            return
           }

           console.log(error)
        }
    }

    useEffect(() => {
        if (router.query.username) {
            setValue('username', String(router.query.username))
        }
    },[router.query?.username, setValue])

    return (
        <Container>
            <Header>
                <Heading as="strong" >
                Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>

            <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size='sm'>Nome de usuário</Text>
                    <TextInput prefix='ignite.com/' placeholder='seu-usuario' {...register('username')}/>

                    {errors.username && (
                        <FormError size="sm">{errors.username.message}</FormError>
                    )}
                </label>

                <label>
                    <Text size='sm'>Nome completo</Text>
                    <TextInput placeholder='seu nome' {...register('name')}/>

                    {errors.name && (
                        <FormError size="sm">{errors.name.message}</FormError>
                    )}
                </label>

                <Button type="submit"  disabled={isSubmitting} >
                    Próximo passo
                    <ArrowArcRight />
                </Button>
            </Form>
        </Container>
    )   
}