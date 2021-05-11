const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/login', userController.postLogin);
router.post('/join', userController.postJoin);

// 질병 데이터 업데이트
router.post('/all-data', userController.postAllData);

// 특정 데이터 업데이트
router.post('/data', userController.postData);

// 발병률 계산 후 저장
router.post('/ml-risk', userController.postMLRisk);

// 발병률 데이터
router.post('/receive-all-disease', userController.postReceiveAllDisease);
router.post('/send-all-disease', userController.postSendAllDisease);

// 사용자 정보 + 발병률
router.post('/send-all-data', userController.postSendAllData);

// 오늘의 발병률 
router.post('/send-day-health', userController.postSendDayHealth);

router.post('/check-id', userController.postCheckId);

module.exports = router; 
