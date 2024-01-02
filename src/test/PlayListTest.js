import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navigation/Navbar';
import { PC } from '../components/Responsive';
import axios from 'axios';
import Loading from '../components/Loading';
import { useRecoilState } from 'recoil';
import { currentVideoIndexAtom, playStateAtom, videoIdListAtom } from '../state/MusicPlayerAtom';

// test/1
function PlayListTest() {
    const [isLoading, setIsLoading] = useState(true);

    const [videoIdList, setVideoIdList] = useRecoilState(videoIdListAtom);
    const [playState, setPlayState] = useRecoilState(playStateAtom);
    const [currentVideoIndex, setCurrentVideoIndex] = useRecoilState(currentVideoIndexAtom); // 현재 재생 중인 동영상의 인덱스

    const [playlistData, setPlaylistData] = useState([]);
    const [musicInfoList, setMusicInfoList] = useState([]);

    useEffect(() => {
        setIsLoading(true); // API 호출 전에 true로 설정하여 로딩화면 띄우기

        axios.get(`https://9d71-121-143-39-62.ngrok-free.app/api/playlist/my/48`, {
            headers: {
                'Content-Type': `application/json`,
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'ngrok-skip-browser-warning': '69420', // ngrok ERR_NGROK_6024 오류 관련 헤더
            },
        })
            .then((response) => {
                console.log("서버에서 받아온 결과", response.data);
                const temp1 = response.data;
                setPlaylistData(temp1);

                const temp2 = response.data.musicInfoList;
                setMusicInfoList(temp2);

                // const temp3 = response.data.musicInfoList.map(item => `https://www.youtube.com/watch?v=` + item.videoId);
                // setVideoIdList(temp3);

                setIsLoading(false); // API 호출이 완료되면 false로 변경하여 로딩화면 숨김처리
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }, [])

    const addPlayList = () => {
        setVideoIdList([])
        setVideoIdList((prev) => [...prev, [musicInfoList], ...musicInfoList.map(item => `https://www.youtube.com/watch?v=` + item.videoId)])
        console.log("비디오리스트: ", videoIdList)

        setPlayState(!playState);
        // 만약 재생 중이지 않다면 첫 번째 동영상을 재생
        if (!playState && currentVideoIndex === null) {
            setCurrentVideoIndex(1);
            // setCurrentVideoTitle(sampleResult.items[0].snippet.title);
        }
    }

    return (
        <div>
            <PC>
                <div className='row'>
                    <div className='col-md-3'>
                        <Navbar />
                    </div>
                    <div className='col-md-9'>
                        <div className='text-start mt-3'>
                            <p>playlist image</p>
                            <h2>{playlistData.title}</h2>
                        </div>
                        <div className='d-flex justify-content-center mt-3 mb-3'>
                            <button className='btn btn-primary btn-sm' onClick={() => addPlayList()}>재생</button>
                        </div>
                        <div>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">제목</th>
                                        <th scope="col"></th>
                                        <th scope="col">가수</th>
                                        <th scope="col">앨범</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? <tr><td><Loading /></td></tr> : null}
                                    {musicInfoList.map((music, index) => (
                                        <tr key={index}>
                                            <td style={{ verticalAlign: "middle" }}>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={music.albumUrl}
                                                    alt="앨범 이미지"
                                                    style={{ verticalAlign: "middle", maxWidth: '50px', maxHeight: '50px' }}
                                                />
                                            </td>
                                            <td style={{ verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: music.musicTitle }}></td>
                                            <td style={{ verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: music.musicArtist }}></td>
                                            <td style={{ verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: music.albumName }}></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </PC>
        </div>
    );
}

export default PlayListTest;