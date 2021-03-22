import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TagType from 'src/entity/tag.entity';
import { Itag } from 'src/schema/tag.schema';

@Injectable()
export class TagService {
    constructor(@InjectModel('Tag') private TagModel: Model<Itag>) {}
    
    async update(tagName: string, selected: string[], i: number) {
        let tag = await this.TagModel.findOne({name: tagName}).exec()
        const rel = [...selected.slice(0,i), ...selected.slice(i+1)]
        if(tag !== null) {
            console.log("if 안", tag)
            const newRelated = [...new Set(...rel, ...tag.related)]
            await this.TagModel.updateOne({_id: tag._id}, {$set: {related: newRelated}})
        }
        else {
            console.log("if 밖", tag)
            const newTag = new this.TagModel({
                name: tagName,
                related: rel
            })
            await newTag.save()
        }
    }
}