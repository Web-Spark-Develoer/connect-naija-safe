-- Create enums for the app
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'non_binary', 'other');
CREATE TYPE public.looking_for_type AS ENUM ('relationship', 'casual', 'friendship', 'networking');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.swipe_action AS ENUM ('like', 'pass', 'super_like');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'gold', 'platinum');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- User roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  bio TEXT,
  occupation TEXT,
  education TEXT,
  height_cm INTEGER,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_city TEXT,
  looking_for looking_for_type[] DEFAULT ARRAY['relationship']::looking_for_type[],
  min_age_preference INTEGER DEFAULT 18,
  max_age_preference INTEGER DEFAULT 50,
  max_distance_km INTEGER DEFAULT 50,
  gender_preference gender_type[],
  verification_status verification_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  daily_swipes_remaining INTEGER DEFAULT 20,
  daily_super_likes_remaining INTEGER DEFAULT 1,
  swipes_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  profile_boost_active_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Interests table (predefined interests)
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- User interests junction table
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, interest_id)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- User photos table
CREATE TABLE public.user_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

-- Swipes table (tracks all swipe actions)
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action swipe_action NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (swiper_id, swiped_id)
);

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Matches table (mutual likes)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_b_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_a_id, user_b_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Virtual gifts table
CREATE TABLE public.virtual_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gift_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;

-- Profile boosts table
CREATE TABLE public.profile_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_boosts ENABLE ROW LEVEL SECURITY;

-- User reports table
CREATE TABLE public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status report_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Blocks table
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Verification requests table
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  selfie_url TEXT,
  id_document_url TEXT,
  video_url TEXT,
  status verification_status DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles: users can view their own roles, admins can view all
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles: users can CRUD their own, view others who are active
CREATE POLICY "Users can view active profiles" ON public.profiles
  FOR SELECT USING (is_active = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Interests: everyone can view
CREATE POLICY "Anyone can view interests" ON public.interests
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage interests" ON public.interests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User interests: users can manage their own
CREATE POLICY "Users can view all interests" ON public.user_interests
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own interests" ON public.user_interests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests" ON public.user_interests
  FOR DELETE USING (auth.uid() = user_id);

-- User photos: users can manage their own, view others
CREATE POLICY "Users can view all photos" ON public.user_photos
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert own photos" ON public.user_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON public.user_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON public.user_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Swipes: users can only see their own swipes
CREATE POLICY "Users can view own swipes" ON public.swipes
  FOR SELECT USING (auth.uid() = swiper_id);

CREATE POLICY "Users can insert own swipes" ON public.swipes
  FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches: users can view matches they're part of
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "System can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can update own matches" ON public.matches
  FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Messages: users can view/send in their matches
CREATE POLICY "Users can view match messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user_a_id = auth.uid() OR user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user_a_id = auth.uid() OR user_b_id = auth.uid())
      AND is_active = TRUE
    )
  );

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user_a_id = auth.uid() OR user_b_id = auth.uid())
    )
  );

-- Virtual gifts
CREATE POLICY "Users can view received gifts" ON public.virtual_gifts
  FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

CREATE POLICY "Users can send gifts" ON public.virtual_gifts
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Profile boosts
CREATE POLICY "Users can view own boosts" ON public.profile_boosts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boosts" ON public.profile_boosts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User reports
CREATE POLICY "Users can view own reports" ON public.user_reports
  FOR SELECT USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Users can create reports" ON public.user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update reports" ON public.user_reports
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Blocks
CREATE POLICY "Users can view own blocks" ON public.blocks
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks" ON public.blocks
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete own blocks" ON public.blocks
  FOR DELETE USING (auth.uid() = blocker_id);

-- Verification requests
CREATE POLICY "Users can view own verification" ON public.verification_requests
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Users can create verification request" ON public.verification_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update verification" ON public.verification_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Functions

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if two users have matched
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reverse_like_exists BOOLEAN;
  new_match_id UUID;
BEGIN
  -- Only check for matches on 'like' or 'super_like' actions
  IF NEW.action IN ('like', 'super_like') THEN
    -- Check if the other user has also liked this user
    SELECT EXISTS (
      SELECT 1 FROM public.swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND action IN ('like', 'super_like')
    ) INTO reverse_like_exists;
    
    -- If mutual like, create a match
    IF reverse_like_exists THEN
      -- Check if match doesn't already exist
      IF NOT EXISTS (
        SELECT 1 FROM public.matches
        WHERE (user_a_id = NEW.swiper_id AND user_b_id = NEW.swiped_id)
           OR (user_a_id = NEW.swiped_id AND user_b_id = NEW.swiper_id)
      ) THEN
        INSERT INTO public.matches (user_a_id, user_b_id)
        VALUES (LEAST(NEW.swiper_id, NEW.swiped_id), GREATEST(NEW.swiper_id, NEW.swiped_id))
        RETURNING id INTO new_match_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION public.check_and_create_match();

-- Function to reset daily swipes
CREATE OR REPLACE FUNCTION public.reset_daily_swipes(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tier subscription_tier;
  swipe_limit INTEGER;
  super_like_limit INTEGER;
BEGIN
  SELECT subscription_tier INTO user_tier FROM public.profiles WHERE user_id = _user_id;
  
  CASE user_tier
    WHEN 'platinum' THEN
      swipe_limit := 999999; -- Unlimited
      super_like_limit := 5;
    WHEN 'gold' THEN
      swipe_limit := 100;
      super_like_limit := 3;
    ELSE
      swipe_limit := 20;
      super_like_limit := 1;
  END CASE;
  
  UPDATE public.profiles
  SET daily_swipes_remaining = swipe_limit,
      daily_super_likes_remaining = super_like_limit,
      swipes_reset_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Function to decrement swipes
CREATE OR REPLACE FUNCTION public.use_swipe(_user_id UUID, _is_super_like BOOLEAN DEFAULT FALSE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  swipes_left INTEGER;
  super_likes_left INTEGER;
  last_reset TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT daily_swipes_remaining, daily_super_likes_remaining, swipes_reset_at
  INTO swipes_left, super_likes_left, last_reset
  FROM public.profiles
  WHERE user_id = _user_id;
  
  -- Reset if more than 24 hours since last reset
  IF last_reset < now() - INTERVAL '24 hours' THEN
    PERFORM public.reset_daily_swipes(_user_id);
    SELECT daily_swipes_remaining, daily_super_likes_remaining
    INTO swipes_left, super_likes_left
    FROM public.profiles
    WHERE user_id = _user_id;
  END IF;
  
  IF _is_super_like THEN
    IF super_likes_left <= 0 THEN
      RETURN FALSE;
    END IF;
    UPDATE public.profiles
    SET daily_super_likes_remaining = daily_super_likes_remaining - 1
    WHERE user_id = _user_id;
  ELSE
    IF swipes_left <= 0 THEN
      RETURN FALSE;
    END IF;
    UPDATE public.profiles
    SET daily_swipes_remaining = daily_swipes_remaining - 1
    WHERE user_id = _user_id;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Insert default interests
INSERT INTO public.interests (name, category, icon) VALUES
  ('Music', 'Entertainment', '🎵'),
  ('Movies', 'Entertainment', '🎬'),
  ('Gaming', 'Entertainment', '🎮'),
  ('Reading', 'Entertainment', '📚'),
  ('Travel', 'Lifestyle', '✈️'),
  ('Cooking', 'Lifestyle', '👨‍🍳'),
  ('Fitness', 'Health', '💪'),
  ('Yoga', 'Health', '🧘'),
  ('Dancing', 'Entertainment', '💃'),
  ('Photography', 'Creative', '📷'),
  ('Art', 'Creative', '🎨'),
  ('Fashion', 'Lifestyle', '👗'),
  ('Sports', 'Health', '⚽'),
  ('Hiking', 'Outdoor', '🥾'),
  ('Beach', 'Outdoor', '🏖️'),
  ('Nightlife', 'Social', '🌙'),
  ('Coffee', 'Food & Drink', '☕'),
  ('Wine', 'Food & Drink', '🍷'),
  ('Dogs', 'Pets', '🐕'),
  ('Cats', 'Pets', '🐱'),
  ('Tech', 'Professional', '💻'),
  ('Entrepreneurship', 'Professional', '🚀'),
  ('Spirituality', 'Lifestyle', '🙏'),
  ('Afrobeats', 'Entertainment', '🥁'),
  ('Football', 'Sports', '⚽'),
  ('Basketball', 'Sports', '🏀'),
  ('Golf', 'Sports', '⛳'),
  ('Gym', 'Health', '🏋️');