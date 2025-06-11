export default class SchedulerStatus {
    private scheduler_status: {
     [key:number]:{
         [key:number]:string
     }
    } = {};

    addScheduleStatus = (schedule_id:number,param_seq_no:number) => {
        this.scheduler_status[schedule_id][param_seq_no] = 'RUNNING';
    }

    removeScheduleStatus = (schedule_id:number,param_seq_no:number) =>{
        delete this.scheduler_status[schedule_id][param_seq_no];
    }

    getScheduleStatus = (schedule_id:number,param_seq_no:number) => {
        return this.scheduler_status[schedule_id][param_seq_no];
    }

    resetScheduleStatus = () => {
        console.log('reset schedule status called');
        this.scheduler_status = {};
    }

}