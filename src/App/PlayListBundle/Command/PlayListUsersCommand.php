<?php
namespace App\PlayListBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use App\PlayListBundle\Entity\Users;

class PlayListUsersCommand extends ContainerAwareCommand
{
   protected function configure()
   {
       $this
           ->setName('app:playlist:users')
           ->setDescription('Добавление пользователей')
           ->addArgument('username', InputArgument::REQUIRED, 'Логин')
           ->addArgument('password', InputArgument::REQUIRED, 'Пароль')
       ;
   }

   protected function execute(InputInterface $input, OutputInterface $output)
   {
       $username = $input->getArgument('username');
       $password = $input->getArgument('password');

       $em = $this->getContainer()->get('doctrine')->getManager();

       $user = new Users();
       $user->setUsername($username);
       $factory = $this->getContainer()->get('security.encoder_factory');
       $encoder = $factory->getEncoder($user);
       $encodedPassword = $encoder->encodePassword($password, $user->getSalt());
       $user->setPassword($encodedPassword);
       $em->persist($user);
       $em->flush();

       $output->writeln(sprintf('user %s added with password %s', $username, $password));
   }
}