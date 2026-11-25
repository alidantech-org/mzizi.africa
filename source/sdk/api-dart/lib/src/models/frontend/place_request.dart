import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'place_request.g.dart';

/// Place Request
@JsonSerializable(includeIfNull: false)
class FrontendPlaceRequest {
  const FrontendPlaceRequest({required this.country, this.lang, this.place});
  final String country;
  final String? lang;
  final String? place;

  factory FrontendPlaceRequest.fromJson(Map<String, dynamic> json) => _$FrontendPlaceRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendPlaceRequestToJson(this);
}
