"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#001f3f" }}>
      {/* Logo */}
      <a href="/client/dashboard" className="h-44 flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
          alt="Fanta"
          style={{ width: "300px", height: "150px"}}
        />
      </a>

      {/* Content */}
      <div className="px-4 pt-10 mb-10 max-w-lg mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-8">About Us</h2>

        <div className="text-center text-white mb-8">
          <p className="text-lg leading-relaxed">
            FANTA EARN is a e-commerce company, FANTA EARN provides a complete set of services for online retailers including marketing and shop templates to simplify the process of opening an online store for small businesses. Increase sales and increase product popularity.
          </p>
          <br />
          <p className="text-lg leading-relaxed">
            FANTA EARN is an online marketplace created in November 2016 to level the playing field for online retailers and provide better e-commerce for everyone. FANTA EARN never holds any of its own retail inventory, and every product on the site is listed by an independent business, so anyone looking to sell on FANTA EARN will only be competing with other sellers, not the platform itself.
          </p>
          <br />
          <p className="text-lg leading-relaxed">
            If you want to know more, please feel free to contact us. You can learn about and contact us through the following channels.
          </p>
        </div>
      </div>
    </div>
  );
}
