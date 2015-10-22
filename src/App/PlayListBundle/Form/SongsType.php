<?php

namespace App\PlayListBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SongsType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title')
            //->add('url')
			->add('file', 'file', ['label' => 'Файл', 'required' => true])
            ->add('authors')
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'App\PlayListBundle\Entity\Songs'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'app_playlistbundle_songs';
    }
}
