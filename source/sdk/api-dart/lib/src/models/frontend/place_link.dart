import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'place_link.g.dart';

/// Place Link
@JsonSerializable(includeIfNull: false)
class FrontendPlaceLink {
  const FrontendPlaceLink({required this.code, required this.id, this.kind, required this.name});
  final String code;
  final String id;
  final SharedLocalizedText? kind;
  final SharedLocalizedText name;

  factory FrontendPlaceLink.fromJson(Map<String, dynamic> json) => _$FrontendPlaceLinkFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendPlaceLinkToJson(this);
}
