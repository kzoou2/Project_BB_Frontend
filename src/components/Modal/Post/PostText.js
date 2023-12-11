import React, { useEffect, useRef, useState } from 'react';
import { SiHeadspace } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import { Overlay, TextInputModalWrap, Contents, Button } from '../../../style/styled_components/PostModal_Style';
import ModalContainer from '../Config/ModalContainer';
import useOutSideClick from '../../../hooks/useOutSideClick';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../../../style/css/Hashtag.css';

function PostText({ onClose, imageSrc }) {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [hashtagList, setHashtagList] = useState([]);

    const postFeed = () => {
        console.log("글 게시 완료");
        console.log("해시태그 리스트: ", hashtagList);
        navigate('/')
    }

    const handleClose = () => {
        onClose?.();
    };

    useEffect(() => {
        const $body = document.querySelector("body");
        const overflow = $body.style.overflow;
        $body.style.overflow = "hidden";
        return () => {
            $body.style.overflow = overflow
        };
    }, []);

    useEffect(() => {
        const input = document.getElementById('hashtagInput');
        const tagify = new Tagify(input);

        // 태그가 추가되면 이벤트 발생
        tagify.on('add', function (e) {
            console.log("태그", tagify.value); // 입력된 태그 정보 객체
        });

        setHashtagList(tagify.value);

        // 컴포넌트가 언마운트될 때에는 Tagify 인스턴스를 정리
        return () => {
            tagify.destroy();
        };
    }, []);

    useOutSideClick(modalRef, handleClose);

    return (
        <div>
            <ModalContainer>
                <Overlay>
                    <TextInputModalWrap ref={modalRef}>
                        <Contents>
                            <h3 className='d-flex justify-content-center'>New Post (PostText)</h3>
                            <div className='d-flex justify-content-center'>
                                <hr style={{ width: "80%" }} />
                            </div>

                            <div className='d-flex justify-content-center'>
                                <div className='d-flex justify-content-center' style={{ width: "40%" }}>
                                    <img className='mt-5' style={{ width: "80%", height: "80%" }} src={imageSrc} alt="Album cover" />
                                </div>
                                <div style={{ width: "60%" }}>
                                    <div className='d-flex justify-content-center mb-3'>
                                        <a href='/profile'><SiHeadspace className='me-2' size='40' color='gray' />User Nickname</a>
                                    </div>
                                    <div className='d-flex flex-column align-items-center mb-3'>
                                        <input type="text" className="form-control mb-2" placeholder="" style={{ width: "70%", height: "250px" }} />
                                        <input id='hashtagInput' type="text" className="form-control" placeholder="해시태그를 추가하세요." />
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center mt-4'>
                                <Button className='btn btn-primary' onClick={() => postFeed()}>Post</Button>
                            </div>
                        </Contents>
                    </TextInputModalWrap>
                </Overlay>
            </ModalContainer>
        </div>
    );
}

export default PostText;
