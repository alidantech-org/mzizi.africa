import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'institution_request.g.dart';

/// Institution Request
@JsonSerializable(includeIfNull: false)
class FrontendInstitutionRequest {
  const FrontendInstitutionRequest({required this.country, required this.institution, this.lang});
  final String country;
  final String institution;
  final String? lang;

  factory FrontendInstitutionRequest.fromJson(Map<String, dynamic> json) => _$FrontendInstitutionRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendInstitutionRequestToJson(this);
}
