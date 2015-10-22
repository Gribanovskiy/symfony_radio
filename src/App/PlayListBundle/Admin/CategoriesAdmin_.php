<?php

namespace App\PlayListBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class CategoriesAdmin extends Admin
{
    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
			->with('General')
            ->add('name', 'text', array('label' => 'Название'))
            ->add('title', 'text', array('label' => 'Заголовок страницы'))
			->add('activity_date', 'datetime', array('label' => 'Дата', 'required' => false))
			->add('active','checkbox', array('label' => 'Активность', 'required' => false))
			->add('sort','integer', array('label' => 'Сортировка', 'required' => false))
			->add('description',null, array('label' => 'Описание', 'required' => false))
			->end()
            ->with('Tasks')
				->add('tasks', 'sonata_type_collection', array('label' => 'Задание', 'required' => false, 'by_reference' => true), array(
					'edit' => 'inline',
					'inline' => 'table'
				))
			->end()
        ;
    }
/*
        activity_date:
            type: date
            unique: true
        active:
            type: integer
            length: 1
        sort:
            type: integer
            length: 255
        description:
            type: text
        title:
            type: string
            length: 255
*/
    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
			->add('sort')
            ->add('name')
            ->add('title')
			->add('active')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            //->add('slug')
			->add('sort')
			->addIdentifier('name')
			->add('active')
			->add('title')
			->add('activity_date')
        ;
    }
}