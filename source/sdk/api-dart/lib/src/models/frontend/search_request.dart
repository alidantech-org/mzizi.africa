import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'search_request.g.dart';

/// Search Request
@JsonSerializable(includeIfNull: false)
class FrontendSearchRequest {
  const FrontendSearchRequest({this.country, this.lang, required this.text});
  final String? country;
  final String? lang;
  final String text;

  factory FrontendSearchRequest.fromJson(Map<String, dynamic> json) => _$FrontendSearchRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendSearchRequestToJson(this);
}
