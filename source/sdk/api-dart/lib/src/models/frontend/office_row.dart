import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'office_row.g.dart';

/// Office Row
@JsonSerializable(includeIfNull: false)
class FrontendOfficeRow {
  const FrontendOfficeRow({this.fromYear, this.holder, this.holderCode, required this.name, required this.office});
  final int? fromYear;
  final SharedLocalizedText? holder;
  final String? holderCode;
  final SharedLocalizedText name;
  final String office;

  factory FrontendOfficeRow.fromJson(Map<String, dynamic> json) => _$FrontendOfficeRowFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendOfficeRowToJson(this);
}
