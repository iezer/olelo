description    'Table aspect'
export_scripts 'handsontable/*.js', 'handsontable/*.css'

Aspects::Aspect.create(:table, priority: 3, layout: true, cacheable: true, hidden: true) do
  def call(context, page)
    @page = page
    render :table_page, locals: {full: context.params[:full]}
  end
end

__END__
@@ table_page.slim
div id="example"
javascript:
  $(document).ready(function () {
    var data = [
      ["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
      ["2009", 0, 2941, 4303, 354, 5814],
      ["2010", 5, 2905, 2867, 412, 5284],
      ["2011", 4, 2517, 4822, 552, 6127],
      ["2012", 2, 2422, 5399, 776, 4151]
    ];

    $('#example').handsontable({
      data: data,
      minRows: 5,
      minCols: 6,
      minSpareRows: 1,
      autoWrapRow: true,
      colHeaders: true,
      contextMenu: true
    });

    $('.ver').text($('#example').data('handsontable').version);
  });
  
