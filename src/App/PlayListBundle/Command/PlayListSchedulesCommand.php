<?php 
namespace App\PlayListBundle\Command; 
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand; 
use Symfony\Component\Console\Input\InputInterface; 
use Symfony\Component\Console\Output\OutputInterface; 
class PlayListSchedulesCommand extends ContainerAwareCommand {
	public function configure() {
		$this ->setDefinition(array()) ->setDescription('Set playlist from table <schedules>') ->setName('playlist:tasks:schedules:setplaylist'); 
		//здесь прописываем имя нашей будущей команды
	} 
	protected function execute(InputInterface $input, OutputInterface $output) {
		//получаем сервис, который будет непосредственно обновлять статусы 
		$stateUpdater = $this->getContainer()->get('app_play_list.schedules_setter'); 
		$stateUpdater->setPlayList(); 
	} 
} 