<?php
namespace App\PlayListBundle\Tests\Admin;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Console\Input\ArrayInput;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

use Sonata\DoctrineORMAdminBundle\Model\ModelManager;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Exception\ModelManagerException;
use Symfony\Bridge\Doctrine\RegistryInterface;

class SongsAdminTest extends WebTestCase{
	public function testOne()
    {
		$this->assertTrue(TRUE);
	}
}