import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/office_row.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'institution_screen.g.dart';

/// Institution Screen
@JsonSerializable(includeIfNull: false)
class FrontendInstitutionScreen {
  const FrontendInstitutionScreen({this.arm, required this.code, required this.language, required this.name, required this.offices});
  final SharedLocalizedText? arm;
  final String code;
  final String language;
  final SharedLocalizedText name;
  final List<FrontendOfficeRow> offices;

  factory FrontendInstitutionScreen.fromJson(Map<String, dynamic> json) => _$FrontendInstitutionScreenFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendInstitutionScreenToJson(this);
}
