package com.koreait.project.yongsoo.command.trainerMeeting;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.ui.Model;

import com.koreait.project.common.CommonMapCommand;
import com.koreait.project.yongsoo.dao.TrainerMeetingDao;
import com.koreait.project.yongsoo.dto.MeetingTemDto;

public class GetTrainerMeetingListCommand implements CommonMapCommand {

	@Override
	public Map<String, Object> execute(SqlSession sqlSession, Model model) {

		Map<String, Object> map = model.asMap();
		int user_no = (int)map.get("user_no");
		
		TrainerMeetingDao trainerMeetingDao = sqlSession.getMapper(TrainerMeetingDao.class);
		// 총 모임 개수
		int totalMeetingCount = trainerMeetingDao.totalMeetingCount(user_no);
		
		// 모임 리스트
		List<MeetingTemDto> meetingList = trainerMeetingDao.findMeetings(user_no);
		
		Map<String, Object> result = new HashMap<String, Object>();
		if (meetingList.size()>0) {
			result.put("result", true);
			result.put("totalMeetingCount", totalMeetingCount);
			result.put("meetingList", meetingList);
		} else {
			result.put("result", false);
			result.put("totalMeetingCount", 0);
		}
		
		return result;
	}

}
