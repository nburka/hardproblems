class Custom404
  def initialize(app, path_to_404_file)
    @app = app
    @path_to_404_file = path_to_404_file
  end

  def call(env)
    result = @app.call(env)
    status_code = result[0]
    if status_code == 404
      not_found_response
    else
      result
    end
  end

  private

  def not_found_response
    [404, { "Content-Type"  => "text/html" }, [not_found_page]]
  end

  def not_found_page
    Tilt.new(@path_to_404_file).render
  end
end