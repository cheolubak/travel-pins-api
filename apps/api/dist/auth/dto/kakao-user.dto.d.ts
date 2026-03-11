export declare class KakaoUserDto {
    id: number;
    has_signed_up?: boolean;
    connected_at?: string;
    synched_at?: string;
    properties?: {
        nickname?: string;
        profile_image?: string;
        thumbnail_image?: string;
    };
    kakao_account?: {
        age_range?: string;
        age_range_needs_agreement?: boolean;
        birthday_needs_agreement?: boolean;
        birthday_type?: 'LUNAR' | 'SOLAR';
        birthyear?: string;
        birthyear_needs_agreement?: boolean;
        ci?: string;
        ci_authenticated_at?: string;
        ci_needs_agreement?: boolean;
        email?: string;
        email_needs_agreement?: boolean;
        gender?: 'female' | 'male';
        gender_needs_agreement?: boolean;
        is_email_valid?: boolean;
        is_email_verified?: boolean;
        is_leap_month?: boolean;
        name?: string;
        name_needs_agreement?: boolean;
        phone_number?: string;
        phone_number_needs_agreement?: boolean;
        profile?: {
            is_default_image?: boolean;
            is_default_nickname?: boolean;
            nickname?: string;
            profile_image_url?: string;
            thumbnail_image_url?: string;
        };
        profile_image_needs_agreement?: boolean;
        profile_needs_agreement?: boolean;
        profile_nickname_needs_agreement?: boolean;
    };
    for_partner?: {};
}
