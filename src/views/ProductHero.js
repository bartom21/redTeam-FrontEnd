import * as React from 'react';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

import ImageFrancoUz from '../images/frente3.png';

export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${ImageFrancoUz})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={ImageFrancoUz}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Por una mirada feliz
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Nuestro propósito es brindar un espacio en el que la persona con diagnóstico de TGD-TEA se encuentre contenido a la vez que lleve a cabo su tratamiento.
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        component="a"
        sx={{ minWidth: 200 }}
      >
        Conozcanos
      </Button>
    </ProductHeroLayout>
  );
}