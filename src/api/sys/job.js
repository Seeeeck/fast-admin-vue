import request from '@/utils/request'

export function pageScheduleJobs(params) {
  return request({
    url: '/sys/schedule/page',
    method: 'get',
    params
  })
}

export function getScheduleJob(id) {
  return request({
    url: '/sys/schedule/' + id,
    method: 'get'
  })
}

export function saveScheduleJob(data) {
  return request({
    url: '/sys/schedule',
    method: 'post',
    data
  })
}

export function updateScheduleJob(data) {
  return request({
    url: '/sys/schedule',
    method: 'put',
    data
  })
}

export function deleteScheduleJobs(ids) {
  return request({
    url: '/sys/schedule/batch',
    method: 'delete',
    params: { ids }
  })
}

export function runScheduleJobs(ids) {
  return request({
    url: '/sys/schedule/run',
    method: 'post',
    params: { ids }
  })
}

export function pauseScheduleJobs(ids) {
  return request({
    url: '/sys/schedule/pause',
    method: 'post',
    params: { ids }
  })
}

export function resumeScheduleJobs(ids) {
  return request({
    url: '/sys/schedule/resume',
    method: 'post',
    params: { ids }
  })
}

export function pageScheduleJobLogs(params) {
  return request({
    url: '/sys/schedule-log/page',
    method: 'get',
    params
  })
}
