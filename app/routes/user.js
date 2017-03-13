'use strict';

exports = module.exports = (requireSession, app, controllers) => {
    /**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login by id and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Login
 */
    app.post('/auth/login', controllers.user.login);

/**
 * @swagger
 * /user/list:
 *   get:
 *     description: show all users in a list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: Admin's token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Show the list of users
 */
    app.get('/user/list', [requireSession, controllers.user.listUser]);

   /**
 * @swagger
 * /auth/registry:
 *   post:
 *     description: Registry new account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Registry
 */
    app.post('/auth/registry', controllers.user.addUser);

        /**
 * @swagger
 * /user/addFriend:
 *   post:
 *     description: Add friend with another user 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: User's token
 *         in: header
 *         required: true
 *         type: string
 * 
 *       - name: FriendID
 *         description: Friend's id
 *         in: formData
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: Add friend
 */

    app.post('/user/addFriend', [requireSession, controllers.user.addFriend]);

/**
 * @swagger
 * /user/history:
 *   get:
 *     description: Check history of purchasing tickets
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: User's token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Show the events that user bought
 */
    app.get('/user/history', [requireSession, controllers.user.historyPurchase]);

       /**
 * @swagger
 * /user/delete:
 *   post:
 *     description: Delete an user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: Admin's token
 *         in: header
 *         required: true
 *         type: string
 * 
 *       - name: id
 *         description: the id of user that need to be deleted
 *         in: formData
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: delete an user for some reasons
 */
    app.post('/user/delete', [requireSession, controllers.user.deleteUser]);
}