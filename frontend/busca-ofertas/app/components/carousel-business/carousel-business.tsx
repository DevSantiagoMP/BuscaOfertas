import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

export default function MySlider() {
  return (
    <Swiper
      modules={[Navigation]}
      navigation               
      spaceBetween={20}
      loop={true}
      breakpoints={{
        0: { slidesPerView: 1.2 }, // móvil
        480: { slidesPerView: 2 }, // pantallas pequeñas
        768: { slidesPerView: 3 }, // tablet
        1024: { slidesPerView: 4 }, // desktop
      }}
    >
      <SwiperSlide>
        <div className="card">Hola este el primer slide</div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="card">Slide 2</div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="card">Slide 3</div>
      </SwiperSlide>
    </Swiper>
  );
}
