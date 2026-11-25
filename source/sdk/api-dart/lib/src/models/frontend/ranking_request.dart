import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/language_choice.dart';

part 'ranking_request.g.dart';

/// Ranking Request
@JsonSerializable(includeIfNull: false)
class FrontendRankingRequest {
  const FrontendRankingRequest({required this.country, required this.indicator, this.lang, this.year});
  final String country;
  final String indicator;
  final String? lang;
  final int? year;

  factory FrontendRankingRequest.fromJson(Map<String, dynamic> json) => _$FrontendRankingRequestFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendRankingRequestToJson(this);
}
