import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'search_hit.g.dart';

/// Search Hit
@JsonSerializable(includeIfNull: false)
class FrontendSearchHit {
  const FrontendSearchHit({required this.code, this.context, required this.kind, required this.name});
  final String code;
  final SharedLocalizedText? context;
  final String kind;
  final SharedLocalizedText name;

  factory FrontendSearchHit.fromJson(Map<String, dynamic> json) => _$FrontendSearchHitFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendSearchHitToJson(this);
}
