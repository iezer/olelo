description    'Table aspect'
export_scripts 'handsontable/*.js', 'handsontable/*.css'

Aspects::Aspect.create(:table, priority: 3, layout: true, cacheable: true, hidden: true) do
  def call(context, page)
    @page = page
    render :table_page, locals: {full: context.params[:full]}
  end
end
