import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'country_link.g.dart';

/// Country Link
@JsonSerializable(includeIfNull: false)
class FrontendCountryLink {
  const FrontendCountryLink({required this.code, required this.id, this.isoAlpha2, required this.name});
  final String code;
  final String id;
  final String? isoAlpha2;
  final SharedLocalizedText name;

  factory FrontendCountryLink.fromJson(Map<String, dynamic> json) => _$FrontendCountryLinkFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendCountryLinkToJson(this);
}
