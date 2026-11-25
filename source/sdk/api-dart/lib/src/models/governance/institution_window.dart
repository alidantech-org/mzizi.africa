import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'institution_window.g.dart';

/// Institution Window
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionWindow {
  const GovernanceInstitutionWindow({this.armTerm, required this.countryId, this.limit, this.offset});
  final String? armTerm;
  final String countryId;
  final int? limit;
  final int? offset;

  factory GovernanceInstitutionWindow.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionWindowFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionWindowToJson(this);
}
