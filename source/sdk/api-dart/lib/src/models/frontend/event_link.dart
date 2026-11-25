import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'event_link.g.dart';

/// Event Link
@JsonSerializable(includeIfNull: false)
class FrontendEventLink {
  const FrontendEventLink({required this.code, required this.name, required this.startsOn});
  final String code;
  final SharedLocalizedText name;
  final DateTime startsOn;

  factory FrontendEventLink.fromJson(Map<String, dynamic> json) => _$FrontendEventLinkFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendEventLinkToJson(this);
}
