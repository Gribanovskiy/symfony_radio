<?php
namespace App\PlayListBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class TasksAdmin extends Admin
{
    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('title', 'text', array('label' => 'Song Title'))
            ->add('categories', 'entity', array('class' => 'App\PlayListBundle\Entity\Categories'))
			->add('songs', 'entity', array('class' => 'App\PlayListBundle\Entity\Songs'))
            //->add('body') //if no type is specified, SonataAdminBundle tries to guess it
        ;
    }

    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('title')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            //->addIdentifier('title')
            //->add('slug')
			->add('id')
            ->add('title')
        ;
    }
}