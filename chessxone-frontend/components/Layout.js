import { useContext } from 'react'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'

import { userContext } from '../store/user/context'
import styles from './layout.module.css'

const Navbar = () => {
    const { state: { user} } = useContext(userContext);
    const router = useRouter()

    const isDefaultPage = router.pathname === '/';
    const isLoginPage = router.pathname === '/login';
    const isSignupPage = router.pathname === '/signup';

    return (
        <div className={styles.navbar_container}>
            <nav>
                <ul>
                    <li>
                        <Link href="/home">
                            <img className={styles.logo} src="/chessone.png" height="50px" width="260px" />
                        </Link>
                    </li>
                    <li >
                        <ul>
                            {user && user.userName ? (
                                <li>
                                    {isDefaultPage ? (
                                        <button className={styles.logged_in_btn}>
                                            <Link href="/home" >
                                                you&apos;re already logged In
                                            </Link>
                                            <img src="/icon/arrow-right.svg" />
                                        </button>

                                    ) : (
                                            <ProfileIcon userName={user.userName} picture={user.picture} />
                                        )}
                                </li>
                            ) : (
                                    <>
                                        {(isDefaultPage || isLoginPage) && (<li> <button> <Link href="/signup" > Sign Up</Link> </button></li>)}
                                        {(isDefaultPage || isSignupPage) && (<li> <button> <Link href="/login">Login </Link></button></li>)}
                                    </>
                                )}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

const Footer = () => (<footer className={styles.footer_container}>
    <ul>
        <li> <p>ChessXone is an online multiplayer chess game based on web  </p></li>
        <li>
            <ul className={styles.links_list}>
                <li>FeedBack</li>
            </ul>
        </li>
        <li>
            <ul className={styles.social_media_list}>
                <li style={{ opacity: '0.5', fontSize: '12px' }} >Authentic</li>
                <li><img src="/icon/discord.svg" /></li>
                <li><img src="/icon/instagram.svg" /></li>
            </ul>
            <div style={{ fontSize: '12px' }}>
                Made for beautiful Minds.
            </div>
            {/* <div style={{ fontSize: '12px' }} >
                made with <img className="icon" src="/icon/heart.svg" /> and <img src="/icon/coffee.svg" className="icon" />  by @ayoubbougue in Algiers
             </div> */}
        </li>
    </ul>
</footer>)
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className={styles.main_container}>
                {children}
            </div>
            <Footer />
        </>
    )
}

const ProfileIcon = ({  userName, picture = '/icon/default.webp' }) => (<>
    <div className={styles.avatar_container}>
        <Link href="/profile">
            {userName}
        </Link>
        <div>
            <Link href="/profile">
                <img referrerPolicy="no-referrer" src={picture} width="25" height="25" />
            </Link>
        </div>
    </div>
</>)


export default Layout
