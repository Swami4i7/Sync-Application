export const fs_node_scheduler = {
    schedule_t: `select xst.schedule_id,xst.schedule_name,xst.frequency_min,xst. bi_report_path,xst.bi_report_name,xst.created_by,xst.creation_date, xst.last_updated_by,xst.last_update_date,xst.last_update_login, xst.status, xst.reset_data,xst.db_table_name,xst.db_column_names,xst.operation,xst.package_to_run_after_process,xst.run_package_at_last_seq, CURSOR(SELECT param_id,schedule_id, param_name, param_value, sequence_no, next_schedule_time, next_schedule_time_temp,created_by, creation_date, last_updated_by, last_update_date from fs_Schedule_parameters_t where schedule_id=xst.schedule_id) parameters from fs_Schedule_t xst`,
    schedule_new_single_t: `SELECT 
      schedule_id,  
      schedule_name,
      frequency_min,
      bi_report_path,
      bi_report_name,
      created_by,
      creation_date,
      last_updated_by,
      last_update_date,
      last_update_login,
      status,
      reset_data,
      db_table_name,
      db_column_names,
      operation,
      package_to_run_after_process,
      run_package_at_last_seq
  FROM fs_Schedule_t`,
    schedule_parameter_join_T: `SELECT 
      xst.schedule_id AS xst_schedule_id,  
      xst.schedule_name,
      xst.frequency_min,
      xst.bi_report_path,
      xst.bi_report_name,
      xst.created_by,
      xst.creation_date,
      xst.last_updated_by,
      xst.last_update_date,
      xst.last_update_login,
      xst.status,
      xst.reset_data,
      xst.db_table_name,
      xst.db_column_names,
      xst.operation,
      xst.package_to_run_after_process,
      xst.run_package_at_last_seq,
      p.param_id,
      p.schedule_id AS p_schedule_id,  
      p.param_name,
      p.param_value,
      p.sequence_no,
      p.next_schedule_time,
      p.next_schedule_time_temp,
      p.created_by AS param_created_by,
      p.creation_date AS param_creation_date,
      p.last_updated_by AS param_last_updated_by,
      p.last_update_date AS param_last_update_date
  FROM fs_Schedule_t xst
  LEFT JOIN fs_Schedule_parameters_t p 
      ON xst.schedule_id = p.schedule_id`,
      parameter_t: `SELECT *  FROM FS_SCHEDULE_PARAMETERS_T WHERE SCHEDULE_ID = :schedule_id`,
    schedule_logs_t: `SELECT * FROM fs_schedule_list_t `,
    sync_logs_all_t: `SELECT * FROM fs_schedule_list_t ORDER BY creation_date DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    sync_logs_all_count_t: `SELECT COUNT(*) AS total FROM fs_schedule_list_t`,
    sync_logs_sid_t: `SELECT * FROM fs_schedule_list_t WHERE schedule_id = NVL(:custom_0, schedule_id) ORDER BY creation_date DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    sync_logs_sid_count_t: `SELECT COUNT(*) AS total FROM fs_schedule_list_t WHERE schedule_id = NVL(:custom_0, schedule_id)`,
    sync_logs_t: `SELECT * FROM fs_schedule_list_t WHERE schedule_id = NVL(:custom_0, schedule_id) AND last_update_date > TRUNC(SYSDATE - :custom_1) ORDER BY creation_date DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    sync_logs_count_t: `SELECT COUNT(*) AS total FROM fs_schedule_list_t WHERE schedule_id = NVL(:custom_0, schedule_id) AND last_update_date > TRUNC(SYSDATE - :custom_1)`,
    schedule_list_t: `select * from fs_schedule_list_t where schedule_id = nvl(:schedule_id, schedule_id) and last_update_date > trunc(sysdate-:no_of_days) order by creation_date desc`,
    schedule_error_log_t: `select * from fs_schedule_err_log_t where table_name = nvl(:table_name, table_name) and creation_date > trunc(sysdate - :no_of_days) order by creation_date desc`,
    schedule_names: `select schedule_name, schedule_id, status from fs_schedule_t`,
    table_names: `select db_table_name, status from fs_schedule_t where status = 'Y'`,
    create_schedule_t: `Insert INTO fs_schedule_t (schedule_id, schedule_name,frequency_min, bi_report_path, bi_report_name,created_by,creation_date,last_updated_by,last_update_date,last_update_login,status,reset_data,db_table_name,db_column_names,operation,package_to_run_after_process,run_package_at_last_seq) VALUES (fs_schedule_s.nextval, :schedule_name, :frequency_min, :bi_report_path, :bi_report_name, :created_by, sysdate, :last_updated_by, sysdate, :last_update_login, :status, :reset_data, :db_table_name, :db_column_names, :operation, :package_to_run_after_process, :run_package_at_last_seq) returning schedule_id into :schedule_id`,
    create_schedule_parameter_t: `Insert INTO fs_schedule_parameters_t (param_id, schedule_id,param_name, param_value, sequence_no, next_schedule_time, next_schedule_time_temp,created_by, creation_date, last_updated_by, last_update_date) values (FS_SCHEDULE_PARAMETERS_seq.nextval, :schedule_id, :param_name, :param_value, :sequence_no,:next_schedule_time,:next_schedule_time_temp, :created_by, sysdate, :last_updated_by, sysdate) returning param_id into :param_id`,
    create_schedule_parameters_bulk: 
  `INSERT INTO fs_schedule_parameters_t 
  (param_id, schedule_id, param_name, param_value, sequence_no, next_schedule_time, next_schedule_time_temp, created_by, creation_date, last_updated_by, last_update_date)
  VALUES (FS_SCHEDULE_PARAMETERS_seq.nextval, :schedule_id, :param_name, :param_value, :sequence_no, :next_schedule_time, :next_schedule_time_temp, :created_by, SYSDATE, :last_updated_by, SYSDATE)
  RETURNING param_id INTO :param_id`,

  delete_schedule_t: `delete from fs_schedule_t where schedule_id = :schedule_id`,
    delete_schedule_parameter_t: `delete from fs_schedule_parameters_t where param_id = :param_id`,
    update_schedule_t: `update fs_schedule_t set schedule_name = :schedule_name, frequency_min = :frequency_min, bi_report_path = :bi_report_path, bi_report_name = :bi_report_name, created_by =:created_by,last_updated_by = :last_updated_by, last_update_login = :last_update_login, status = :status, reset_data = :reset_data, db_table_name = :db_table_name, db_column_names = :db_column_names, operation = :operation, package_to_run_after_process = :package_to_run_after_process, run_package_at_last_seq = :run_package_at_last_seq where schedule_id = :schedule_id`,
    update_schedule_parameter_t: `update fs_schedule_parameters_t set schedule_id = :schedule_id, param_name = :param_name, param_value = :param_value, sequence_no = :sequence_no, next_schedule_time = :next_schedule_time, next_schedule_time_temp = nvl(:next_schedule_time_temp,next_schedule_time_temp), last_updated_by = :last_updated_by, last_update_date = sysdate  where param_id = :param_id`,
    setup_details_t: `select * from fs_setup_detail where setup_id = :setup_id`,
    schedule_status_t: `select schedule_id, bi_report_name, status from fs_schedule_t where schedule_id = :schedule_id`,
    update_setup_detail_t: `update fs_setup_detail set fusion_domain = :fusion_domain, fusion_username = :fusion_username, fusion_password = :fusion_password, mail_notification = :mail_notification where setup_id = :setup_id`,
    create_details_t: `Insert INTO fs_setup_detail (setup_id, fusion_domain, fusion_username, fusion_password, mail_notification) VALUES (:setup_id, :fusion_domain, :fusion_username, :fusion_password, :mail_notification)`,
    create_users: `Insert INTO FS_SCHEDULE_USERS (user_id, user_name, password, role, created_by, creation_date, last_updated_by, last_update_date) VALUES (fs_schedule_user_s.nextval, upper(:user_name), :password, :role, :created_by, sysdate, :last_updated_by, sysdate) returning user_id INTO :user_id`,
    get_user: `select * from FS_SCHEDULE_USERS where user_id = :user_id order by user_id desc`,
    get_users: `select * from FS_SCHEDULE_USERS`,
    update_users: `update FS_SCHEDULE_USERS set user_name = upper(:user_name), password = :password, role = :role, created_by = :created_by, creation_date = sysdate, last_updated_by = :last_updated_by, last_update_date = sysdate where user_id = :user_id`,
    delete_users: `delete from FS_SCHEDULE_USERS where user_id = :user_id`,
    login_users: `select user_id,user_name,role from fs_schedule_users where upper(user_name)=upper(:user_name) and password=:password`,
    get_status: `select schedule_id, bi_report_name, status from fs_schedule_t order by schedule_id, status desc`,
    delete_log_t: `delete from fs_schedule_list_t WHERE creation_date < TRUNC (SYSDATE) - (7 * :no_of_weeks)`,
  schedule_error_logs_t:`select ERR_ID, TABLE_NAME,TO_CHAR(MERGE_QUERY) as MERGE_QUERY ,SCHEDULE_ID, SCHEDULE_LIST_ID, ERR_CODE, ERR_MSG, ERR_STATUS from fs_schedule_err_log_t`, 
  create_schedule_parameter_new_t: `DECLARE v_schedule_id NUMBER;

  BEGIN
      INSERT INTO fs_schedule_t (
          schedule_id, schedule_name, frequency_min, bi_report_path, 
          bi_report_name, created_by, creation_date, last_updated_by, 
          last_update_date, last_update_login, status, reset_data, 
          db_table_name, db_column_names, operation, 
          package_to_run_after_process, run_package_at_last_seq
      ) 
      VALUES (
          FS_schedule_s.nextval, :schedule_name, :frequency_min, :bi_report_path, 
          :bi_report_name, 'ADMIN', SYSDATE, 'ADMIN', SYSDATE, 
          'ADMIN', :status, :reset_data, :db_table_name, 
          :db_column_names, :operation, :package_to_run_after_process, 
          :run_package_at_last_seq
      ) 
      RETURNING schedule_id INTO v_schedule_id;
  
      INSERT INTO fs_schedule_parameters_t (
          param_id, schedule_id, param_name, param_value, sequence_no, 
          next_schedule_time, next_schedule_time_temp, created_by, 
          creation_date, last_updated_by, last_update_date
      ) 
      VALUES (
          FS_SCHEDULE_PARAMETERS_seq.nextval, v_schedule_id, :param_name, :param_value, 
          :sequence_no, :next_schedule_time, :next_schedule_time_temp, 
          'ADMIN', SYSDATE, 'ADMIN', SYSDATE
      );
      :schedule_id := v_schedule_id; 
  END;`,
    get_schedule: `
          BEGIN
              fs_node_scheduler.get_schedule(
                  p_cursor => :cursor,
                  p_fusion_domain => :domain,
                  p_fusion_uname => :username,
                  p_fusion_pwd => :password,
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
          END;
          `,
    get_table_columns: `
          BEGIN
              fs_node_scheduler.get_table_columns(
                  p_table_name => :table_name,
                  p_cursor => :cursor,
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
              END;
          `,
    ins_schdl_list: `
          BEGIN
              fs_node_scheduler.ins_schdl_list(
                  p_schedule_id => :schedule_id,
                  p_table_name => :table_name,
                  p_seq_no => :seq_no,
                  p_schdl_list => :schedule_list,
                  p_table_struct => :table_structure,
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
              END;
          `,
    execute_merge_query: `
          BEGIN
              fs_node_scheduler.execute_merge_query(
                  p_table_name => :table_name,
                  p_merge => :query,
                  p_schedule_id => :schedule_id,
                  l_schedule_list_id => :schdl_list_id,
                p_err_code => :err_code,
                  p_err_msg => :err_msg,
                p_err_status => :err_status
              );
              END;
          `,
    upd_schdl_list_status: `
          BEGIN
              fs_node_scheduler.upd_schdl_list_status(
                  p_schdl_list_id => :schdl_list_id,
                  p_seq_no => :seq_no,
                  p_last_seq => :last_seq,
                  p_report_record_count => :record_count,
                  p_status => :status,
                  p_err_status => :err_status,
                p_err_msg => :err_msg
              );
              END;
          `,
    reset_schdl_list_status: `
          BEGIN
              fs_node_scheduler.reset_schdl_list_status(
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
              END;
          `,
    get_schedule_params: `
          BEGIN
              fs_node_scheduler.get_schedule_params(
                  p_schedule_id => :schedule_id,
                  p_param_count => :params_count,
                  p_cursor => :params,
                  p_already_running => :already_running,
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
              END;
          `,
    mail_notification: `
          BEGIN
              fs_node_scheduler.mail_notification(
                  p_mail_notification_flag => :mailNotificationFlag,
                  p_record_count => :recordCount,
                  p_mail_from => :mailFrom,
                  p_mail_to => :mailTo,
                  p_mail_subject => :mailSubject,
                  p_cursor => :mailContent,
                  p_err_code => :err_code,
                  p_err_msg => :err_msg
              );
              END;
          `,
  };
  