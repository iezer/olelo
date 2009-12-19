author       'Daniel Mendler'
description  'Proprietary web portal based user storage'
dependencies 'gem:nokogiri'

User.define_service(:portal) do
  autoload 'Nokogiri', 'nokogiri'
  autoload 'OpenSSL', 'openssl'

  def authenticate(name, password)
    require 'open-uri'

    xml = open(Wiki::Config.auth.portal_uri,
               :ssl_verify_mode => OpenSSL::SSL::VERIFY_NONE,
               :http_basic_authentication => [name, password]).read

    # User data is exposed as xml
    doc = Nokogiri::XML(xml)
    email = (doc/'person/email').text
    name = (doc/'person/user/name').text
    groups = (doc/'person/groups/group/name').map(&:inner_text)
    raise if name.blank?
    email = "#{name}@localhost" if email.blank?
    User.new(name, email, groups)
  rescue
    raise StandardError, 'Wrong username or password'
  end
end
